package com.hotel.hotel_app.controller;

import com.hotel.hotel_app.model.BillDTO;
import com.hotel.hotel_app.model.BookingRequest;
import com.hotel.hotel_app.model.Customer;
import com.hotel.hotel_app.model.FoodItem;
import com.hotel.hotel_app.model.FoodOrder;
import com.hotel.hotel_app.model.FoodOrderRequest;
import com.hotel.hotel_app.model.Room;
import com.hotel.hotel_app.repository.FoodItemRepository;
import com.hotel.hotel_app.repository.FoodOrderRepository;
import com.hotel.hotel_app.repository.RoomRepository;
import com.hotel.hotel_app.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private FoodOrderRepository foodOrderRepository;

    @Autowired
    private RoomRepository roomRepository;

    // --- Room Endpoints ---

    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        return hotelService.getAllRooms();
    }

    @PutMapping("/rooms/{roomNumber}/book")
    public ResponseEntity<Room> bookRoom(
            @PathVariable int roomNumber,
            @RequestBody BookingRequest bookingRequest) {
                
        Room updatedRoom = hotelService.bookRoom(
                roomNumber,
                bookingRequest.getCustomerName(),
                bookingRequest.getCustomerContact()
        );

        if (updatedRoom != null) {
            return ResponseEntity.ok(updatedRoom);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ... inside HotelController class ...

    // --- UPDATED VACATE ENDPOINT WITH VERIFICATION ---
    @PostMapping("/rooms/{roomNumber}/vacate")
    public ResponseEntity<?> vacateRoom(
            @PathVariable int roomNumber, 
            @RequestBody BookingRequest verificationDetails // Reuse BookingRequest for Name/Contact
    ) {
        // 1. Get the room
        Room room = roomRepository.findByRoomNumber(roomNumber);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }
        
        // 2. Verify Room is actually booked
        if (!room.isBooked()) {
            return ResponseEntity.badRequest().body("Room is already empty.");
        }

        // 3. --- CRITICAL VERIFICATION STEP ---
        // Normalize strings (trim spaces, ignore case) for better UX
        String dbName = room.getCustomerName().trim();
        String dbContact = room.getCustomerContact().trim();
        
        String inputName = verificationDetails.getCustomerName().trim();
        String inputContact = verificationDetails.getCustomerContact().trim();

        // Check matching (Case insensitive for name, exact for phone)
        boolean nameMatch = dbName.equalsIgnoreCase(inputName);
        boolean contactMatch = dbContact.equals(inputContact);

        if (!nameMatch || !contactMatch) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Verification Failed: Name or Contact does not match our records.");
        }

        // 4. If Verified, Proceed to Vacate
        // Calculate Bill
        BillDTO bill = hotelService.calculateBill(roomNumber);
        
        // Clear Room Data
        hotelService.vacateRoom(roomNumber);
        
        // Return Bill
        return ResponseEntity.ok(bill);
    }

    // --- Bill Endpoint ---

    @GetMapping("/rooms/{roomNumber}/bill")
    public ResponseEntity<BillDTO> getRoomBill(@PathVariable int roomNumber) {
        BillDTO bill = hotelService.calculateBill(roomNumber);
        if (bill != null) {
            return ResponseEntity.ok(bill);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Food Endpoints ---

    @GetMapping("/menu")
    public List<FoodItem> getFoodMenu() {
        return foodItemRepository.findAll();
    }

    @GetMapping("/orders")
    public List<FoodOrder> getAllOrders() {
        return foodOrderRepository.findAll();
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createFoodOrder(@RequestBody FoodOrderRequest orderRequest) {
        Room room = roomRepository.findByRoomNumber(orderRequest.getRoomNumber());

        if (room == null || !room.isBooked()) {
            return new ResponseEntity<>("Room is not booked or does not exist", HttpStatus.BAD_REQUEST);
        }

        FoodOrder newOrder = new FoodOrder();
        newOrder.setRoomNumber(orderRequest.getRoomNumber());
        newOrder.setItemName(orderRequest.getItemName());
        newOrder.setItemPrice(orderRequest.getItemPrice());
        newOrder.setOrderTime(LocalDateTime.now());

        FoodOrder savedOrder = foodOrderRepository.save(newOrder);
        
        return ResponseEntity.ok(savedOrder);
    }

    // --- UPDATED Customer Endpoint ---
    
    // We change the return type to List<CustomerDashboardDTO>
    @GetMapping("/customers")
    public List<com.hotel.hotel_app.model.CustomerDashboardDTO> getCustomers() {
        return hotelService.getCustomerDashboard();
    }
}
package com.hotel.hotel_app.service;

import com.hotel.hotel_app.model.Room;
import com.hotel.hotel_app.model.BillDTO;
import com.hotel.hotel_app.model.FoodOrder;
import com.hotel.hotel_app.model.Customer; // <-- Essential Import
import com.hotel.hotel_app.repository.RoomRepository;
import com.hotel.hotel_app.repository.FoodOrderRepository;
import com.hotel.hotel_app.repository.CustomerRepository; // <-- Essential Import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional; // <-- FIXES ERROR: cannot find symbol class Optional

@Service
public class HotelService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private FoodOrderRepository foodOrderRepository;

    // --- FIXES ERROR: cannot find symbol variable customerRepository ---
    @Autowired
    private CustomerRepository customerRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    
    public List<Room> getAvailableRooms() {
        return roomRepository.findByIsBooked(false);
    }

    public Room bookRoom(int roomNumber, String customerName, String customerContact) {
        Room roomToBook = roomRepository.findByRoomNumber(roomNumber);

        if (roomToBook != null && !roomToBook.isBooked()) {
            
            // --- Save Customer Logic ---
            Optional<Customer> existingCustomer = customerRepository.findByContact(customerContact);

            if (existingCustomer.isPresent()) {
                Customer customer = existingCustomer.get();
                customer.setName(customerName);
                customerRepository.save(customer);
            } else {
                Customer newCustomer = new Customer();
                newCustomer.setName(customerName);
                newCustomer.setContact(customerContact);
                customerRepository.save(newCustomer);
            }

            // --- Update Room Logic ---
            roomToBook.setBooked(true);
            roomToBook.setCustomerName(customerName);
            roomToBook.setCustomerContact(customerContact);
            
            return roomRepository.save(roomToBook);
        }
        return null;
    }

    public Room vacateRoom(int roomNumber) {
        Room roomToVacate = roomRepository.findByRoomNumber(roomNumber);
        if (roomToVacate != null) {
            foodOrderRepository.deleteByRoomNumber(roomNumber);
            roomToVacate.setBooked(false);
            roomToVacate.setCustomerName(null);
            roomToVacate.setCustomerContact(null);
            return roomRepository.save(roomToVacate);
        }
        return null;
    }

    public BillDTO calculateBill(int roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber);
        if (room == null) return null; 

        List<FoodOrder> foodOrders = foodOrderRepository.findByRoomNumber(roomNumber);
        double roomPrice = room.getPrice();
        double foodTotal = foodOrders.stream().mapToDouble(FoodOrder::getItemPrice).sum();
        double grandTotal = roomPrice + foodTotal;

        BillDTO bill = new BillDTO();
        bill.setRoomPrice(roomPrice);
        bill.setFoodItems(foodOrders);
        bill.setFoodTotal(foodTotal);
        bill.setGrandTotal(grandTotal);
        return bill;
    }
    
    // --- FIXES ERROR: cannot find symbol method getAllCustomers() ---
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    public java.util.List<com.hotel.hotel_app.model.CustomerDashboardDTO> getCustomerDashboard() {
        List<Customer> customers = customerRepository.findAll();
        java.util.List<com.hotel.hotel_app.model.CustomerDashboardDTO> dashboardList = new java.util.ArrayList<>();

        for (Customer c : customers) {
            // Check if this customer currently occupies a room
            Room activeRoom = roomRepository.findByCustomerContact(c.getContact());

            if (activeRoom != null) {
                // Calculate the full bill breakdown
                BillDTO bill = calculateBill(activeRoom.getRoomNumber());
                
                dashboardList.add(new com.hotel.hotel_app.model.CustomerDashboardDTO(
                    c.getId(),
                    c.getName(),
                    c.getContact(),
                    String.valueOf(activeRoom.getRoomNumber()),
                    "Occupied",
                    bill.getRoomPrice(),  // Room Bill
                    bill.getFoodTotal(),  // Food Bill
                    bill.getGrandTotal(), // Total Bill
                    "Pending"
                ));
            } else {
                // Past customer
                dashboardList.add(new com.hotel.hotel_app.model.CustomerDashboardDTO(
                    c.getId(),
                    c.getName(),
                    c.getContact(),
                    "---",
                    "Checked Out",
                    0.00, // Room Bill
                    0.00, // Food Bill
                    0.00, // Total Bill
                    "Paid"
                ));
            }
        }
        return dashboardList;
    }
}
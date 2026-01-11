package com.hotel.hotel_app.repository;

import com.hotel.hotel_app.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Custom method to find rooms based on booking status
    List<Room> findByIsBooked(boolean isBooked);

    // Custom method to find a single room by its room number
    Room findByRoomNumber(int roomNumber);

    Room findByCustomerContact(String customerContact);
}
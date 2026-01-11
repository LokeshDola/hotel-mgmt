package com.hotel.hotel_app.repository;

import com.hotel.hotel_app.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, String> {
    // We don't need extra methods; findById (which finds by username) is enough
}
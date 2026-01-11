package com.hotel.hotel_app.model;

// This class is a DTO (Data Transfer Object)
// It maps to the JSON our frontend will send
public class FoodOrderRequest {

    private int roomNumber;
    private String itemName;
    private double itemPrice;

    // --- Getters and Setters ---
    
    public int getRoomNumber() {
        return roomNumber;
    }
    public void setRoomNumber(int roomNumber) {
        this.roomNumber = roomNumber;
    }
    public String getItemName() {
        return itemName;
    }
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
    public double getItemPrice() {
        return itemPrice;
    }
    public void setItemPrice(double itemPrice) {
        this.itemPrice = itemPrice;
    }
}
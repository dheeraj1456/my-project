package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class GatePass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String rollNo;
    private String reason;
    private String timeSlot;
    private String status;

    // AI suggestion field
    private String aiSuggestion;

    public GatePass(){}

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id=id;
    }

    public String getStudentName(){
        return studentName;
    }

    public void setStudentName(String studentName){
        this.studentName=studentName;
    }

    public String getRollNo(){
        return rollNo;
    }

    public void setRollNo(String rollNo){
        this.rollNo=rollNo;
    }

    public String getReason(){
        return reason;
    }

    public void setReason(String reason){
        this.reason=reason;
    }

    public String getTimeSlot(){
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot){
        this.timeSlot=timeSlot;
    }

    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status=status;
    }

    public String getAiSuggestion(){
        return aiSuggestion;
    }

    public void setAiSuggestion(String aiSuggestion){
        this.aiSuggestion=aiSuggestion;
    }
}
package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class EntryLog {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String rollNo;

private LocalDateTime entryTime;

private LocalDateTime exitTime;

public Long getId(){ return id; }
public void setId(Long id){ this.id=id; }

public String getRollNo(){ return rollNo; }
public void setRollNo(String rollNo){ this.rollNo=rollNo; }

public LocalDateTime getEntryTime(){ return entryTime; }
public void setEntryTime(LocalDateTime entryTime){ this.entryTime=entryTime; }

public LocalDateTime getExitTime(){ return exitTime; }
public void setExitTime(LocalDateTime exitTime){ this.exitTime=exitTime; }

}
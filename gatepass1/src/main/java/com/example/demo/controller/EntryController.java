package com.example.demo.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.EntryLog;
import com.example.demo.repository.EntryLogRepository;

@RestController
@RequestMapping("/api/entry")
@CrossOrigin
public class EntryController {

@Autowired
private EntryLogRepository repository;

/* QR Scan → Automatic Entry / Exit */

@PostMapping("/scan")
public EntryLog scan(@RequestBody EntryLog log){

EntryLog existing = repository.findTopByRollNoAndExitTimeIsNull(log.getRollNo());

/* If student already entered but not exited → EXIT */

if(existing != null){

existing.setExitTime(LocalDateTime.now());

return repository.save(existing);

}

/* Otherwise → ENTRY */

else{

EntryLog newEntry = new EntryLog();

newEntry.setRollNo(log.getRollNo());

newEntry.setEntryTime(LocalDateTime.now());

return repository.save(newEntry);

}

}

/* Get all entry logs for dashboard */

@GetMapping("/all")
public Iterable<EntryLog> getAll(){

return repository.findAll();

}

}
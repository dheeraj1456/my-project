package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.EntryLog;

public interface EntryLogRepository extends JpaRepository<EntryLog,Long>{

EntryLog findTopByRollNoAndExitTimeIsNull(String rollNo);

}
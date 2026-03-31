package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.GatePass;

public interface GatePassRepository extends JpaRepository<GatePass, Long>{

    List<GatePass> findByRollNo(String rollNo);

}
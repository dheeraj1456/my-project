package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.GatePass;
import com.example.demo.repository.GatePassRepository;

@Service
public class GatePassService {

    @Autowired
    private GatePassRepository repository;

    // AI logic
    public String getAISuggestion(GatePass pass){

        String reason = pass.getReason().toLowerCase();

        if(reason.contains("medical") || reason.contains("hospital")){
            return "APPROVE";
        }

        if(reason.contains("emergency")){
            return "APPROVE";
        }

        if(reason.contains("personal") || reason.contains("outing")){
            return "REVIEW";
        }

        return "REJECT";
    }

    // create pass
    public GatePass createPass(GatePass pass){

        pass.setStatus("UNAPPROVED");

        String ai = getAISuggestion(pass);

        pass.setAiSuggestion(ai);

        return repository.save(pass);
    }

    public List<GatePass> getAllPasses(){
        return repository.findAll();
    }

    public GatePass approvePass(Long id){

        GatePass pass = repository.findById(id).orElse(null);

        if(pass!=null){
            pass.setStatus("APPROVED");
            repository.save(pass);
        }

        return pass;
    }

    public GatePass unapprovePass(Long id){

        GatePass pass = repository.findById(id).orElse(null);

        if(pass!=null){
            pass.setStatus("UNAPPROVED");
            repository.save(pass);
        }

        return pass;
    }

    public void deletePass(Long id){
        repository.deleteById(id);
    }

    public GatePass getPassById(Long id){
        return repository.findById(id).orElse(null);
    }

    public List<GatePass> getPassByRoll(String roll){
        return repository.findByRollNo(roll);
    }
}
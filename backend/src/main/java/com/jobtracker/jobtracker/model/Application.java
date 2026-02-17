package com.jobtracker.jobtracker.model;

import java.time.LocalDate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "applications")
public class Application {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String positionTitle;

    private String location;

    @Enumerated(EnumType.STRING)
    private WorkMode workMode;

    private String applicationSource;

    private String jobPostingUrl;

    private Integer salaryMin;

    private Integer salaryMax;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @Column(nullable = false)
    private LocalDate applicationDate;

    private LocalDate nextStepDate;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;



    public Application() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public String getCompanyName() {
        return companyName;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    public String getPositionTitle() {
        return positionTitle;
    }
    public void setPositionTitle(String positionTitle) {
        this.positionTitle = positionTitle;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public WorkMode getWorkMode() {
        return workMode;
    }
    public void setWorkMode(WorkMode workMode) {
        this.workMode = workMode;
    }
    public String getApplicationSource() {
        return applicationSource;
    }
    public void setApplicationSource(String applicationSource) {
        this.applicationSource = applicationSource;
    }
    public String getJobPostingUrl() {
        return jobPostingUrl;
    }
    public void setJobPostingUrl(String jobPostingUrl) {
        this.jobPostingUrl = jobPostingUrl;
    }
    public Integer getSalaryMax() {
        return salaryMax;
    }
    public void setSalaryMax(Integer salaryMax) {
        this.salaryMax = salaryMax;
    }
    public Integer getSalaryMin() {
        return salaryMin;
    }
    public void setSalaryMin(Integer salaryMin) {
        this.salaryMin = salaryMin;
    }
    public ApplicationStatus getStatus() {
        return status;
    }
    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
    public LocalDate getApplicationDate() {
        return applicationDate;
    }
    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }
    public LocalDate getNextStepDate() {
        return nextStepDate;
    }
    public void setNextStepDate(LocalDate nextStepDate) {
        this.nextStepDate = nextStepDate;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }   
    
}

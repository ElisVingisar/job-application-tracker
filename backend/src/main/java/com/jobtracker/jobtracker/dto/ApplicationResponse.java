package com.jobtracker.jobtracker.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.jobtracker.jobtracker.model.ApplicationStatus;
import com.jobtracker.jobtracker.model.WorkMode;

public class ApplicationResponse {

    private Long id;
    private String companyName;
    private String positionTitle;
    private String location;
    private WorkMode workMode;
    private String applicationSource;
    private String jobPostingUrl;
    private Integer salaryMin;
    private Integer salaryMax;
    private ApplicationStatus status;
    private LocalDate applicationDate;
    private LocalDate nextStepDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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

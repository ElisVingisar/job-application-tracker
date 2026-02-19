package com.jobtracker.jobtracker.dto;

import java.time.LocalDate;
import com.jobtracker.jobtracker.model.ApplicationStatus;
import com.jobtracker.jobtracker.model.WorkMode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public class ApplicationRequest {
    
    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Position title is required")
    private String positionTitle;

    private String location;
    private WorkMode workMode;
    private String applicationSource;
    private String jobPostingUrl;
    private Integer salaryMin;
    private Integer salaryMax;

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    @NotNull(message = "Application date is required")
    private LocalDate applicationDate;

    private LocalDate nextStepDate;

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
}

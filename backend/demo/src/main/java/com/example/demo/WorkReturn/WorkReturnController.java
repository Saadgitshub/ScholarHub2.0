package com.example.demo.WorkReturn;

import com.example.demo.Student.Student;
import com.example.demo.Student.StudentRepository;
import com.example.demo.Assignment.Assignment;
import com.example.demo.Assignment.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workreturns")
public class WorkReturnController {

    private static final Logger LOGGER = Logger.getLogger(WorkReturnController.class.getName());

    @Value("${file.upload-dir:D:/AzureDevopsScholarhub/ScholarHub/backend/uploads/}")
    private String UPLOAD_DIR;

    @Autowired
    private WorkReturnRepository workReturnRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createWorkReturn(
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam("studentId") Long studentId,
            @RequestParam("file") MultipartFile file) {
        try {
            if (assignmentId == null || studentId == null) {
                LOGGER.warning("[DEBUG] POST /api/workreturns - Missing assignmentId or studentId");
                return ResponseEntity.badRequest().body(createErrorResponse("Assignment ID and Student ID are required"));
            }

            if (file == null || file.isEmpty()) {
                LOGGER.warning("[DEBUG] POST /api/workreturns - Empty file uploaded");
                return ResponseEntity.badRequest().body(createErrorResponse("File is empty or missing"));
            }

            String fileName = file.getOriginalFilename();
            if (fileName == null || !(fileName.toLowerCase().endsWith(".pdf") || 
                                      fileName.toLowerCase().endsWith(".doc") || 
                                      fileName.toLowerCase().endsWith(".docx"))) {
                LOGGER.warning("[DEBUG] POST /api/workreturns - Invalid file type: " + fileName);
                return ResponseEntity.badRequest().body(createErrorResponse("Only PDF, DOC, DOCX files are allowed"));
            }

            Optional<Student> studentOpt = studentRepository.findById(studentId);
            if (!studentOpt.isPresent()) {
                LOGGER.warning("[DEBUG] POST /api/workreturns - Student not found: " + studentId);
                return ResponseEntity.badRequest().body(createErrorResponse("Student not found"));
            }
            Student student = studentOpt.get();

            Optional<Assignment> assignmentOpt = assignmentRepository.findById(assignmentId);
            if (!assignmentOpt.isPresent()) {
                LOGGER.warning("[DEBUG] POST /api/workreturns - Assignment not found: " + assignmentId);
                return ResponseEntity.badRequest().body(createErrorResponse("Assignment not found"));
            }
            Assignment assignment = assignmentOpt.get();

            String uniqueFileName = UUID.randomUUID() + "_" + fileName;
            File dest = new File(UPLOAD_DIR, uniqueFileName);
            try {
                dest.getParentFile().mkdirs();
                LOGGER.info("[DEBUG] POST /api/workreturns - Saving file to: " + dest.getAbsolutePath());
                file.transferTo(dest);
            } catch (IOException e) {
                LOGGER.severe("[DEBUG] POST /api/workreturns - Failed to save file: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(createErrorResponse("Failed to save file: " + e.getMessage()));
            }

            WorkReturn workReturn = new WorkReturn();
            workReturn.setFilePath("/uploads/" + uniqueFileName);
            workReturn.setStudent(student);
            workReturn.setAssignment(assignment);

            LOGGER.info("[DEBUG] POST /api/workreturns - Saving WorkReturn for assignmentId: " + assignmentId);
            WorkReturn savedWorkReturn;
            try {
                savedWorkReturn = workReturnRepository.save(workReturn);
                LOGGER.info("[DEBUG] POST /api/workreturns - Saved WorkReturn: " + savedWorkReturn.getId());
            } catch (Exception e) {
                LOGGER.severe("[DEBUG] POST /api/workreturns - Database save failed: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(createErrorResponse("Failed to save WorkReturn to database: " + e.getMessage()));
            }

            assignment.setStatus("SUBMITTED");
            try {
                assignmentRepository.save(assignment);
                LOGGER.info("[DEBUG] POST /api/workreturns - Updated assignment status to SUBMITTED: " + assignmentId);
            } catch (Exception e) {
                LOGGER.severe("[DEBUG] POST /api/workreturns - Failed to update assignment status: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(createErrorResponse("Failed to update assignment status: " + e.getMessage()));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", savedWorkReturn.getId());
            response.put("fileUrl", savedWorkReturn.getFilePath());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            LOGGER.severe("[DEBUG] POST /api/workreturns - Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Unexpected error processing WorkReturn: " + e.getMessage()));
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WorkReturn>> getAllWorkReturns(
            @RequestParam(value = "groupId", required = false) Long groupId,
            @RequestParam(value = "studentId", required = false) Long studentId) {
        LOGGER.info("[DEBUG] GET /api/workreturns - Fetching WorkReturns, groupId: " + groupId + ", studentId: " + studentId);
        List<WorkReturn> workReturns = workReturnRepository.findAll();
        LOGGER.info("[DEBUG] GET /api/workreturns - Total WorkReturns before filtering: " + workReturns.size());

        if (studentId != null) {
            workReturns = workReturns.stream()
                    .filter(wr -> wr.getStudent() != null && wr.getStudent().getId().equals(studentId))
                    .collect(Collectors.toList());
            LOGGER.info("[DEBUG] GET /api/workreturns - Filtered by studentId: " + studentId + ", found: " + workReturns.size());
        } else if (groupId != null) {
            workReturns = workReturns.stream()
                    .filter(wr -> wr.getAssignment() != null &&
                            wr.getAssignment().getGroup() != null &&
                            wr.getAssignment().getGroup().getId().equals(groupId))
                    .collect(Collectors.toList());
            LOGGER.info("[DEBUG] GET /api/workreturns - Filtered by groupId: " + groupId + ", found: " + workReturns.size());
        }

        LOGGER.info("[DEBUG] GET /api/workreturns - Found " + workReturns.size() + " WorkReturns after filtering");
        return new ResponseEntity<>(workReturns, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getWorkReturnById(@PathVariable Long id) {
        LOGGER.info("[DEBUG] GET /api/workreturns/" + id + " - Fetching WorkReturn");
        Optional<WorkReturn> workReturn = workReturnRepository.findById(id);
        if (workReturn.isPresent()) {
            LOGGER.info("[DEBUG] GET /api/workreturns/" + id + " - Found WorkReturn");
            return new ResponseEntity<>(workReturn.get(), HttpStatus.OK);
        } else {
            LOGGER.warning("[DEBUG] GET /api/workreturns/" + id + " - WorkReturn not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse("WorkReturn not found"));
        }
    }

    @GetMapping(value = "/{id}/download")
    public ResponseEntity<Resource> downloadWorkReturnFile(@PathVariable Long id) {
        LOGGER.info("[DEBUG] GET /api/workreturns/" + id + "/download - Downloading file");
        Optional<WorkReturn> workReturnOpt = workReturnRepository.findById(id);
        if (!workReturnOpt.isPresent()) {
            LOGGER.warning("[DEBUG] GET /api/workreturns/" + id + "/download - WorkReturn not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        WorkReturn workReturn = workReturnOpt.get();
        String filePath = workReturn.getFilePath();
        if (filePath == null || !filePath.startsWith("/uploads/")) {
            LOGGER.warning("[DEBUG] GET /api/workreturns/" + id + "/download - Invalid file path: " + filePath);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        String fileName = filePath.substring("/uploads/".length());
        File file = new File(UPLOAD_DIR, fileName);
        if (!file.exists()) {
            LOGGER.warning("[DEBUG] GET /api/workreturns/" + id + "/download - File not found: " + file.getAbsolutePath());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Resource resource = new FileSystemResource(file);
        String contentType = fileName.toLowerCase().endsWith(".pdf") ? "application/pdf" :
                            fileName.toLowerCase().endsWith(".doc") || fileName.toLowerCase().endsWith(".docx") ?
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "application/octet-stream";

        LOGGER.info("[DEBUG] GET /api/workreturns/" + id + "/download - Serving file: " + file.getAbsolutePath());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> updateWorkReturn(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        LOGGER.info("[DEBUG] PUT /api/workreturns/" + id + " - Updating WorkReturn");
        Optional<WorkReturn> workReturnOpt = workReturnRepository.findById(id);
        if (!workReturnOpt.isPresent()) {
            LOGGER.warning("[DEBUG] PUT /api/workreturns/" + id + " - WorkReturn not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse("WorkReturn not found"));
        }

        WorkReturn workReturn = workReturnOpt.get();
        try {
            if (updates.containsKey("grade")) {
                Object gradeObj = updates.get("grade");
                Integer grade = gradeObj instanceof Integer ? (Integer) gradeObj : null;
                if (gradeObj != null && grade == null) {
                    try {
                        grade = Integer.parseInt(gradeObj.toString());
                    } catch (NumberFormatException e) {
                        LOGGER.warning("[DEBUG] PUT /api/workreturns/" + id + " - Invalid grade format: " + gradeObj);
                        return ResponseEntity.badRequest().body(createErrorResponse("Invalid grade format"));
                    }
                }
                if (grade != null && (grade < 0 || grade > 100)) {
                    LOGGER.warning("[DEBUG] PUT /api/workreturns/" + id + " - Grade out of range: " + grade);
                    return ResponseEntity.badRequest().body(createErrorResponse("Grade must be between 0 and 100"));
                }
                workReturn.setGrade(grade);
                LOGGER.info("[DEBUG] PUT /api/workreturns/" + id + " - Set grade to: " + grade);
            }

            WorkReturn updatedWorkReturn = workReturnRepository.save(workReturn);
            LOGGER.info("[DEBUG] PUT /api/workreturns/" + id + " - Updated WorkReturn");
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedWorkReturn.getId());
            response.put("fileUrl", updatedWorkReturn.getFilePath());
            response.put("grade", updatedWorkReturn.getGrade());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.severe("[DEBUG] PUT /api/workreturns/" + id + " - Failed to update WorkReturn: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to update WorkReturn: " + e.getMessage()));
        }
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> deleteWorkReturn(@PathVariable Long id) {
        LOGGER.info("[DEBUG] DELETE /api/workreturns/" + id + " - Deleting WorkReturn");
        if (workReturnRepository.existsById(id)) {
            workReturnRepository.deleteById(id);
            LOGGER.info("[DEBUG] DELETE /api/workreturns/" + id + " - Deleted WorkReturn");
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            LOGGER.warning("[DEBUG] DELETE /api/workreturns/" + id + " - WorkReturn not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse("WorkReturn not found"));
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        return error;
    }
}
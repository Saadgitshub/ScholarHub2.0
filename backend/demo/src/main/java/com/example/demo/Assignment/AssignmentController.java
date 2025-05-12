package com.example.demo.Assignment;

import com.example.demo.Group.Group;
import com.example.demo.Group.GroupRepository;
import com.example.demo.Program.Program;
import com.example.demo.Program.ProgramRepository;
import com.example.demo.Subject.Subject;
import com.example.demo.Subject.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private static final Logger LOGGER = Logger.getLogger(AssignmentController.class.getName());

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ProgramRepository programRepository;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createAssignment(@RequestBody AssignmentDTO assignmentDTO) {
        try {
            // Validate DTO
            if (assignmentDTO.getSubjectId() == null || assignmentDTO.getGroupId() == null || assignmentDTO.getProgramId() == null) {
                LOGGER.warning("[DEBUG] POST /api/assignments - Missing subjectId, groupId, or programId");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Subject, group, and program are required");
                return ResponseEntity.badRequest().body(error);
            }

            // Fetch related entities
            Optional<Subject> subjectOpt = subjectRepository.findById(assignmentDTO.getSubjectId());
            if (!subjectOpt.isPresent()) {
                LOGGER.warning("[DEBUG] POST /api/assignments - Subject not found: " + assignmentDTO.getSubjectId());
                Map<String, String> error = new HashMap<>();
                error.put("message", "Subject not found");
                return ResponseEntity.badRequest().body(error);
            }
            Optional<Group> groupOpt = groupRepository.findById(assignmentDTO.getGroupId());
            if (!groupOpt.isPresent()) {
                LOGGER.warning("[DEBUG] POST /api/assignments - Group not found: " + assignmentDTO.getGroupId());
                Map<String, String> error = new HashMap<>();
                error.put("message", "Group not found");
                return ResponseEntity.badRequest().body(error);
            }
            Optional<Program> programOpt = programRepository.findById(assignmentDTO.getProgramId());
            if (!programOpt.isPresent()) {
                LOGGER.warning("[DEBUG] POST /api/assignments - Program not found: " + assignmentDTO.getProgramId());
                Map<String, String> error = new HashMap<>();
                error.put("message", "Program not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Map DTO to entity
            Assignment assignment = new Assignment();
            assignment.setTitle(assignmentDTO.getTitle());
            assignment.setDescription(assignmentDTO.getDescription());
            assignment.setDelay(assignmentDTO.getDelay());
            assignment.setStatus("Not Started"); // Default status
            assignment.setSubject(subjectOpt.get());
            assignment.setGroup(groupOpt.get());
            assignment.setProgram(programOpt.get());

            LOGGER.info("[DEBUG] POST /api/assignments - Creating assignment: " + assignment.getTitle());
            Assignment savedAssignment = assignmentRepository.save(assignment);
            LOGGER.info("[DEBUG] POST /api/assignments - Saved assignment: " + savedAssignment.getId());

            // Map back to DTO for response
            AssignmentDTO responseDTO = new AssignmentDTO();
            responseDTO.setId(savedAssignment.getId());
            responseDTO.setTitle(savedAssignment.getTitle());
            responseDTO.setDescription(savedAssignment.getDescription());
            responseDTO.setDelay(savedAssignment.getDelay());
            responseDTO.setSubjectId(savedAssignment.getSubject().getId());
            responseDTO.setGroupId(savedAssignment.getGroup().getId());
            responseDTO.setProgramId(savedAssignment.getProgram().getId());

            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            LOGGER.severe("[DEBUG] POST /api/assignments - Failed to create assignment: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create assignment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody AssignmentDTO assignmentDTO) {
        try {
            // Validate DTO
            if (assignmentDTO.getSubjectId() == null || assignmentDTO.getGroupId() == null || assignmentDTO.getProgramId() == null) {
                LOGGER.warning("[DEBUG] PUT /api/assignments/" + id + " - Missing subjectId, groupId, or programId");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Subject, group, and program are required");
                return ResponseEntity.badRequest().body(error);
            }

            // Check if assignment exists
            Optional<Assignment> existingAssignmentOpt = assignmentRepository.findById(id);
            if (!existingAssignmentOpt.isPresent()) {
                LOGGER.warning("[DEBUG] PUT /api/assignments/" + id + " - Assignment not found");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Assignment not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            // Fetch related entities
            Optional<Subject> subjectOpt = subjectRepository.findById(assignmentDTO.getSubjectId());
            if (!subjectOpt.isPresent()) {
                LOGGER.warning("[DEBUG] PUT /api/assignments/" + id + " - Subject not found: " + assignmentDTO.getSubjectId());
                Map<String, String> error = new HashMap<>();
                error.put("message", "Subject not found");
                return ResponseEntity.badRequest().body(error);
            }
            Optional<Group> groupOpt = groupRepository.findById(assignmentDTO.getGroupId());
            if (!groupOpt.isPresent()) {
                LOGGER.warning("[DEBUG] PUT /api/assignments/" + id + " - Group not found: " + assignmentDTO.getGroupId());
                Map<String, String> error = new HashMap<>();
                error.put("message", "Group not found");
                return ResponseEntity.badRequest().body(error);
            }
            Optional<Program> programOpt = programRepository.findById(assignmentDTO.getProgramId());
            if (!programOpt.isPresent()) {
                LOGGER.warning("[DEBUG] PUT /api/assignments/" + id + " - Program not found: " + assignmentDTO.getProgramId());
                Map<String, String> error = new HashMap<>();
                error.put("message", "Program not found");
                return ResponseEntity.badRequest().body(error);
            }

            // Update entity
            Assignment assignment = existingAssignmentOpt.get();
            assignment.setTitle(assignmentDTO.getTitle());
            assignment.setDescription(assignmentDTO.getDescription());
            assignment.setDelay(assignmentDTO.getDelay());
            assignment.setStatus(assignmentDTO.getStatus() != null ? assignmentDTO.getStatus() : "Not Started");
            assignment.setSubject(subjectOpt.get());
            assignment.setGroup(groupOpt.get());
            assignment.setProgram(programOpt.get());

            LOGGER.info("[DEBUG] PUT /api/assignments/" + id + " - Updating assignment: " + assignment.getTitle());
            Assignment savedAssignment = assignmentRepository.save(assignment);
            LOGGER.info("[DEBUG] PUT /api/assignments/" + id + " - Updated assignment: " + savedAssignment.getId());

            // Map back to DTO for response
            AssignmentDTO responseDTO = new AssignmentDTO();
            responseDTO.setId(savedAssignment.getId());
            responseDTO.setTitle(savedAssignment.getTitle());
            responseDTO.setDescription(savedAssignment.getDescription());
            responseDTO.setDelay(savedAssignment.getDelay());
            responseDTO.setStatus(savedAssignment.getStatus());
            responseDTO.setSubjectId(savedAssignment.getSubject().getId());
            responseDTO.setGroupId(savedAssignment.getGroup().getId());
            responseDTO.setProgramId(savedAssignment.getProgram().getId());

            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.severe("[DEBUG] PUT /api/assignments/" + id + " - Failed to update assignment: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update assignment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Assignment> getAllAssignments() {
        LOGGER.info("[DEBUG] GET /api/assignments - Fetching all assignments");
        return assignmentRepository.findAll();
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAssignmentById(@PathVariable Long id) {
        LOGGER.info("[DEBUG] GET /api/assignments/" + id + " - Fetching assignment");
        Optional<Assignment> assignment = assignmentRepository.findById(id);
        if (assignment.isPresent()) {
            AssignmentDTO responseDTO = new AssignmentDTO();
            responseDTO.setId(assignment.get().getId());
            responseDTO.setTitle(assignment.get().getTitle());
            responseDTO.setDescription(assignment.get().getDescription());
            responseDTO.setDelay(assignment.get().getDelay());
            responseDTO.setStatus(assignment.get().getStatus());
            responseDTO.setSubjectId(assignment.get().getSubject().getId());
            responseDTO.setGroupId(assignment.get().getGroup().getId());
            responseDTO.setProgramId(assignment.get().getProgram().getId());
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Assignment not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Assignment> getAllAssignmentsDebug() {
        LOGGER.info("[DEBUG] GET /api/assignments/all - Fetching all assignments for debug");
        return assignmentRepository.findAll();
    }

    @GetMapping(value = "/group/{groupId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Assignment> getAssignmentsByGroup(@PathVariable Long groupId) {
        LOGGER.info("[DEBUG] GET /api/assignments/group/" + groupId + " - Fetching assignments for group");
        return assignmentRepository.findByGroupId(groupId);
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        LOGGER.info("[DEBUG] DELETE /api/assignments/" + id + " - Deleting assignment");
        if (assignmentRepository.existsById(id)) {
            assignmentRepository.deleteById(id);
            LOGGER.info("[DEBUG] DELETE /api/assignments/" + id + " - Deleted assignment");
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            LOGGER.warning("[DEBUG] DELETE /api/assignments/" + id + " - Assignment not found");
            Map<String, String> error = new HashMap<>();
            error.put("message", "Assignment not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
    }
}
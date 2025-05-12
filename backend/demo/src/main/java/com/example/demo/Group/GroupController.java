package com.example.demo.Group;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.example.demo.Level.Level;
import com.example.demo.Level.LevelRepository;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private LevelRepository levelRepository;

    // DTO for input
    public static class GroupInputDTO {
        private String name;
        private Long levelId;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getLevelId() {
            return levelId;
        }

        public void setLevelId(Long levelId) {
            this.levelId = levelId;
        }
    }

    // DTO for output
    public static class GroupDTO {
        private Long id;
        private String name;
        private String levelName;

        public GroupDTO(Long id, String name, String levelName) {
            this.id = id;
            this.name = name;
            this.levelName = levelName;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getLevelName() {
            return levelName;
        }
    }

    // Create a new Group
    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody GroupInputDTO input) {
        try {
            Group group = new Group();
            group.setName(input.getName());
            if (input.getLevelId() != null) {
                Level level = levelRepository.findById(input.getLevelId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid level ID: " + input.getLevelId()));
                group.setLevel(level);
            }
            Group savedGroup = groupRepository.save(group);
            return new ResponseEntity<>(savedGroup, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    private GroupDTO convertToDTO(Group group) {
        String levelName = group.getLevel() != null ? group.getLevel().getName() : "N/A";
        return new GroupDTO(group.getId(), group.getName(), levelName);
    }

    // Get all Groups
    @GetMapping
    public List<GroupDTO> getAllGroups() {
        List<Group> groups = groupRepository.findAll();
        List<GroupDTO> groupDTOs = new ArrayList<>();
        for (Group group : groups) {
            groupDTOs.add(convertToDTO(group));
        }
        return groupDTOs;
    }

    // Get Group by ID
    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        Optional<Group> group = groupRepository.findById(id);
        if (group.isPresent()) {
            return new ResponseEntity<>(group.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Update Group by ID
    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable Long id, @RequestBody GroupInputDTO input) {
        try {
            Optional<Group> groupOpt = groupRepository.findById(id);
            if (groupOpt.isPresent()) {
                Group group = groupOpt.get();
                group.setName(input.getName());
                if (input.getLevelId() != null) {
                    Level level = levelRepository.findById(input.getLevelId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid level ID: " + input.getLevelId()));
                    group.setLevel(level);
                } else {
                    group.setLevel(null);
                }
                Group savedGroup = groupRepository.save(group);
                return new ResponseEntity<>(savedGroup, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Delete Group by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        Optional<Group> group = groupRepository.findById(id);
        if (group.isPresent()) {
            groupRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
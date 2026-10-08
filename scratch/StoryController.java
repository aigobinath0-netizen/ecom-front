package com.ecom.backend.controller;

import com.ecom.backend.model.Story;
import com.ecom.backend.repository.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@CrossOrigin(origins = "*")
public class StoryController {
    
    @Autowired
    private StoryRepository storyRepository;

    @GetMapping
    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }

    @PostMapping
    public Story createStory(@RequestBody Story story) {
        if (story.getImages() != null && !story.getImages().isEmpty()) {
            if (story.getImg() == null || story.getImg().isEmpty()) {
                story.setImg(story.getImages().get(0));
            }
        } else if (story.getImg() != null && !story.getImg().isEmpty()) {
            story.getImages().add(story.getImg());
        }
        return storyRepository.save(story);
    }

    @PutMapping("/{id}")
    public Story updateStory(@PathVariable Long id, @RequestBody Story updated) {
        return storyRepository.findById(id).map(story -> {
            if (updated.getName() != null) story.setName(updated.getName());
            if (updated.getImg() != null) story.setImg(updated.getImg());
            if (updated.getImages() != null) story.setImages(updated.getImages());
            return storyRepository.save(story);
        }).orElseGet(() -> {
            updated.setId(id);
            return storyRepository.save(updated);
        });
    }

    @DeleteMapping("/{id}")
    public void deleteStory(@PathVariable Long id) {
        storyRepository.deleteById(id);
    }

    @PostMapping("/delete/{id}")
    public void deleteStoryPost(@PathVariable Long id) {
        storyRepository.deleteById(id);
    }
}

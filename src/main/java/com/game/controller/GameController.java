package com.game.controller;

import com.game.model.Player;
import com.game.service.GameService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/game")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    @GetMapping("/player")
    public Player create(@RequestParam String name,
                         @RequestParam String type) {
        return service.createPlayer(name, type);
    }

    @GetMapping("/players")
    public List<Player> all() {
        return service.getPlayers();
    }

    @GetMapping("/tick")
    public String tick() {
        service.tick();
        return "ok";
    }
}

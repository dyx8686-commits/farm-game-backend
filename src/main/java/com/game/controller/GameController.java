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

    // 🧑 создать игрока
    @GetMapping("/player")
    public Player create(@RequestParam String name,
                         @RequestParam String type) {
        return service.createPlayer(name, type);
    }

    // 📋 все игроки
    @GetMapping("/players")
    public List<Player> all() {
        return service.getPlayers();
    }

    // ⏱ ручной tick (пока оставляем)
    @GetMapping("/tick")
    public String tick() {
        service.tick();
        return "ok";
    }

    // 🌱 посадка
    @PostMapping("/plant")
    public Player plant(@RequestParam String name) {
        return service.plant(name);
    }
    @PostMapping("/wood")
public Player wood(@RequestParam String name) {
    return service.chopWood(name);
}

@PostMapping("/mine")
public Player mine(@RequestParam String name) {
    return service.mineOre(name);
}
}

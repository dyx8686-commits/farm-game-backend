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

    // ⏱ тик игры
    @GetMapping("/tick")
    public String tick() {
        service.tick();
        return "ok";
    }

    // 🌱 посадка семян
    @PostMapping("/plant")
    public Player plant(@RequestParam String name) {
        return service.plant(name);
    }

    // 🌾 сбор урожая
    @PostMapping("/harvest")
    public Player harvest(@RequestParam String name) {
        return service.harvest(name);
    }

    // 🛒 купить семена
    @PostMapping("/shop/seeds")
    public Player buySeeds(@RequestParam String name,
                           @RequestParam int amount) {
        return service.buySeeds(name, amount);
    }

    // 💰 продать дерево → GOLD
    @PostMapping("/sell/wood")
    public Player sellWood(@RequestParam String name,
                           @RequestParam int amount) {
        return service.sellWood(name, amount);
    }

    // 💰 продать руду → GOLD
    @PostMapping("/sell/ore")
    public Player sellOre(@RequestParam String name,
                          @RequestParam int amount) {
        return service.sellOre(name, amount);
    }

    // 💰 продать еду → GOLD
    @PostMapping("/sell/food")
    public Player sellFood(@RequestParam String name,
                           @RequestParam int amount) {
        return service.sellFood(name, amount);
    }
}

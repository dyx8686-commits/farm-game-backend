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

    // ⏱ tick
    @GetMapping("/tick")
    public String tick() {
        service.tick();
        return "ok";
    }

    // 🌱 посадка
    @PostMapping("/game/plant")
public Player plant(
        @RequestParam String name,
        @RequestParam String item
) {
    return gameService.plant(name);
}

    // 🌲 рубка дерева
    @PostMapping("/wood")
    public Player wood(@RequestParam String name) {
        return service.chopWood(name);
    }

    // ⛏ добыча руды
    @PostMapping("/mine")
    public Player mine(@RequestParam String name) {
        return service.mineOre(name);
    }

    // 💰 продажа дерева → GOLD
    @PostMapping("/sell/wood")
    public Player sellWood(@RequestParam String name,
                           @RequestParam int amount) {
        return service.sellWood(name, amount);
    }

    // 💰 продажа руды → GOLD
    @PostMapping("/sell/ore")
    public Player sellOre(@RequestParam String name,
                          @RequestParam int amount) {
        return service.sellOre(name, amount);
    }

    // 💰 продажа еды → GOLD
    @PostMapping("/sell/food")
    public Player sellFood(@RequestParam String name,
                           @RequestParam int amount) {
        return service.sellFood(name, amount);
    }
    @PostMapping("/shop/buy")
public Player buyItem(@RequestParam String name,
                       @RequestParam String item,
                       @RequestParam int amount) {
    return service.buyItem(name, item, amount);
}
}

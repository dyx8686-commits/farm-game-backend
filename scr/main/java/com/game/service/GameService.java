package com.game.service;

import com.game.model.Player;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameService {

    private final List<Player> players = new ArrayList<>();

    public Player createPlayer(String name, String type) {
        Player p = new Player(name, type);
        players.add(p);
        return p;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void tick() {
        for (Player p : players) {

            switch (p.type) {
                case "FARMER" -> p.resources.put("FOOD", p.resources.get("FOOD") + 10);
                case "WOODCUTTER" -> p.resources.put("WOOD", p.resources.get("WOOD") + 8);
                case "MINER" -> p.resources.put("ORE", p.resources.get("ORE") + 6);
            }
        }
    }
}
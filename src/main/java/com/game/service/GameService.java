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

    for (Player player : players) {

        switch (player.getType()) {

            case "FARMER":
                player.getResources().put(
                        "FOOD",
                        player.getResources().get("FOOD") + 10
                );
                break;

            case "WOODCUTTER":
                player.getResources().put(
                        "WOOD",
                        player.getResources().get("WOOD") + 8
                );
                break;

            case "MINER":
                player.getResources().put(
                        "ORE",
                        player.getResources().get("ORE") + 5
                );
                break;
        }
    }
}

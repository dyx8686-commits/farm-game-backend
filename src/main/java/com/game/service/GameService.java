package com.game.service;

import com.game.model.Player;
import com.game.model.Field;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameService {

    private final List<Player> players = new ArrayList<>();

    // 🧑 создать игрока
    public Player createPlayer(String name, String type) {

        Player player = new Player(name, type);

        players.add(player);

        return player;
    }

    // 📋 получить всех игроков
    public List<Player> getPlayers() {

        return players;
    }

    // ⏱ старый tick (оставляем как есть)
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

    // 🌱 НОВАЯ МЕХАНИКА: ПОСАДКА
    public Player plant(String name) {

        Player player = getPlayer(name);

        // ❌ нет семян
        if (player.getSeeds() <= 0) {
            return player;
        }

        // 🌱 создаём поле
        Field field = new Field();
        field.setPlanted(true);
        field.setReady(false);
        field.setPlantTime(System.currentTimeMillis());
        field.setGrowTime(10000); // 10 сек рост

        // ➕ добавляем поле
        player.getFields().add(field);

        // ❌ тратим семя
        player.setSeeds(player.getSeeds() - 1);

        return player;
    }

    // 🔍 найти игрока по имени
    public Player getPlayer(String name) {

        for (Player player : players) {
            if (player.getName().equals(name)) {
                return player;
            }
        }

        return null;
    }
}

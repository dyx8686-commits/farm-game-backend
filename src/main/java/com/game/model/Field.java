package com.game.model;

public class Field {

    private boolean planted;   // посажено ли растение
    private boolean ready;     // готово ли к сбору

    private long plantTime;    // время посадки
    private long growTime;     // сколько растёт (в мс)

    // ===== GETTERS / SETTERS =====

    public boolean isPlanted() {
        return planted;
    }

    public void setPlanted(boolean planted) {
        this.planted = planted;
    }

    public boolean isReady() {
        return ready;
    }

    public void setReady(boolean ready) {
        this.ready = ready;
    }

    public long getPlantTime() {
        return plantTime;
    }

    public void setPlantTime(long plantTime) {
        this.plantTime = plantTime;
    }

    public long getGrowTime() {
        return growTime;
    }

    public void setGrowTime(long growTime) {
        this.growTime = growTime;
    }
}

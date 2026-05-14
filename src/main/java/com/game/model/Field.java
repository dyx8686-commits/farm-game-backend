package com.game.model;

public class Field {

    private boolean planted;
    private boolean ready;

    private long plantTime;
    private long growTime;

    private String item;

    private String stage; // EMPTY, SEED, GROWING, READY

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

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }
}

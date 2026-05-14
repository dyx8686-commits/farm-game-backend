package com.game.model;

public class Field {

    private String item;

    private String stage; // EMPTY | SEED | GROWING | READY

    private long plantTime;
    private long growTime;

    private boolean ready;

    public Field() {
        this.stage = "EMPTY";
        this.ready = false;
        this.plantTime = 0;
        this.growTime = 0;
        this.item = null;
    }

    // GETTERS / SETTERS

    public String getItem() { return item; }
    public void setItem(String item) { this.item = item; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public long getPlantTime() { return plantTime; }
    public void setPlantTime(long plantTime) { this.plantTime = plantTime; }

    public long getGrowTime() { return growTime; }
    public void setGrowTime(long growTime) { this.growTime = growTime; }

    public boolean isReady() { return ready; }
    public void setReady(boolean ready) { this.ready = ready; }
}

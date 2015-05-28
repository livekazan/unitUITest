package ru.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import java.util.Date;

/*Токены пользователя. Создаются каждый раз при логине*/

@Entity
public class Token extends Identifiable {

    @Column(columnDefinition = "bit(1) default false")
    private boolean active;

    private Date expDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Date getExpDate() {
        return expDate;
    }

    public void setExpDate(Date expDate) {
        this.expDate = expDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

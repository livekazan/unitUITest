package ru.model.entity;

import ru.model.enumPack.Role;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.util.Date;


/*
* интервьюер
* */
@Entity
public class User extends Identifiable {

    private String login;

    /**
     * пароль
     */
    private String password;

    /* ФИО интервьюер */
    private String FIO;

    /**
     * флаг, что пользователь может работать в системе
     * false - не может залогинется
     */
    @Column(columnDefinition = "bit(1) default false")
    private boolean active;

    /**
     * время последнего действия в системе
     */

    private Date lastActiveTime;

    /**
     * Тип роли
     */
    @Enumerated(EnumType.STRING)
    private Role role;


    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }


    public String getFIO() {
        return FIO;
    }

    public void setFIO(String FIO) {
        this.FIO = FIO;
    }

    public Date getLastActiveTime() {
        return lastActiveTime;
    }

    public void setLastActiveTime(Date lastActiveTime) {
        this.lastActiveTime = lastActiveTime;
    }

}

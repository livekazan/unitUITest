package ru.model.entity;

import org.hibernate.annotations.Cascade;
import ru.model.entity.directory.City;
import ru.model.enumPack.Role;

import javax.persistence.*;
import java.util.Date;
import java.util.List;


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

    /*город*/
    @ManyToOne(fetch = FetchType.LAZY)
    private City city;


    @OneToMany(mappedBy ="user",fetch = FetchType.LAZY)
    @Cascade(value = org.hibernate.annotations.CascadeType.DELETE_ORPHAN)
    private List<Token> tokens;


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

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public List<Token> getTokens() {
        return tokens;
    }

    public void setTokens(List<Token> tokens) {
        this.tokens = tokens;
    }
}

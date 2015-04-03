package ru.model.entity.directory;

import ru.model.entity.Identifiable;

import javax.persistence.MappedSuperclass;

@MappedSuperclass
public class DirectoryBase extends Identifiable {

    private String name;

    private Long code;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCode() {
        return code;
    }

    public void setCode(Long code) {
        this.code = code;
    }
}

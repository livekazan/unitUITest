package ru.model.entity.directory;

import ru.model.enumPack.DocumentState;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;


/*
* город
* */
@Entity
public class City extends DirectoryBase {

    /**
     * статус
     */
    @Enumerated(EnumType.STRING)
    private DocumentState documentState;

    public DocumentState getDocumentState() {
        return documentState;
    }

    public void setDocumentState(DocumentState documentState) {
        this.documentState = documentState;
    }
}

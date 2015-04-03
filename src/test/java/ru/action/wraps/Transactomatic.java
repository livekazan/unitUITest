package ru.action.wraps;

public interface Transactomatic {
    void perform(UnitOfWork work) throws Exception;
}

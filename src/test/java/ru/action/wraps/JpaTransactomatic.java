package ru.action.wraps;

import junit.framework.AssertionFailedError;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.PersistenceException;

/**
 * why do you need this class, you may ask, spring will do everything! - well the thing is it doesn't whenever you need
 * to have multiple defined transactions within your code, then you need this. like if you want to put some data in the
 * database, then (in a separate tx) check if its there you might also want to call multiple "service" calls in a single
 * tx, or you may wish to call some method that has no aop-advice around it. In any case, you need this.
 */
public class JpaTransactomatic implements Transactomatic {

    private final EntityManager entityManager;

    public JpaTransactomatic(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    // @Override
    public void perform(UnitOfWork work) throws Exception {
        EntityTransaction transaction = entityManager.getTransaction();
        transaction.begin();
        try {
            work.work();
            if (!transaction.getRollbackOnly()) {
                transaction.commit();
            }
        } catch (PersistenceException e) {
            throw e;
        }catch(AssertionFailedError e){
            transaction.rollback();
            throw e;
        } catch (Exception e) {
            transaction.rollback();
            throw e;
        }
    }
}

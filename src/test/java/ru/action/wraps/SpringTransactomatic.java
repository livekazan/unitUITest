package ru.action.wraps;

import org.springframework.context.ApplicationContext;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

/**
 * why do you need this class, you may ask, spring will do everything! - well the thing is it doesn't whenever you need
 * to have multiple defined transactions within your code, then you need this. like if you want to put some data in the
 * database, then (in a separate tx) check if its there you might also want to call multiple "service" calls in a single
 * tx, or you may wish to call some method that has no aop-advice around it. In any case, you need this.
 */
public class SpringTransactomatic implements Transactomatic {

    private final PlatformTransactionManager transactionManager;

    public SpringTransactomatic(TypedApplicationContext context) {
        this(context.bean(PlatformTransactionManager.class, "transactionManager"));
    }

    public SpringTransactomatic(ApplicationContext context) {
        this(context, "transactionManager");
    }

    public SpringTransactomatic(ApplicationContext context, String name) {
        this((PlatformTransactionManager) context.getBean(name));
    }

    public SpringTransactomatic(PlatformTransactionManager transactionManager) {
        this.transactionManager = transactionManager;
    }

    public void perform(UnitOfWork work) throws Exception {

        TransactionStatus transaction = transactionManager.getTransaction(new DefaultTransactionDefinition());

        try {
            work.work();

            if (transaction.isRollbackOnly()) {
                transactionManager.rollback(transaction);
            } else {
                transactionManager.commit(transaction);
            }
        } catch (Exception e) {
            transactionManager.rollback(transaction);
            throw e;
        }
    }
}

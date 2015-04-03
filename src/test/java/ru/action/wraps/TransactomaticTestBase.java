package ru.action.wraps;

import org.junit.After;
import org.junit.Before;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

public abstract class TransactomaticTestBase {
	private JpaTransactomatic transactomatic;
	private EntityManager entityManager;
	private TypedApplicationContext testContext;

	@Before
	public void setUp() throws Exception {
		testContext = SpringUtil.getTestContext(usedContexts());
		EntityManagerFactory entityManagerFactory = testContext.bean(EntityManagerFactory.class,
				SpringConstant.ENTITY_MANAGER_FACTORY_BEAN_NAME);
		entityManager = entityManagerFactory.createEntityManager();
		transactomatic = new JpaTransactomatic(entityManager);
	}

	/**
	 * Добавлено из-за проблемы с нехваткой heap space
	 * @throws Exception
	 */
	@After
	public void tearDown() throws Exception {
		entityManager.clear();
		testContext.close();
		System.gc();
	}
	
	public abstract String[] usedContexts();

	public JpaTransactomatic getTransactomatic() {
		return transactomatic;
	}

	public void setTransactomatic(JpaTransactomatic transactomatic) {
		this.transactomatic = transactomatic;
	}

	public EntityManager getEntityManager() {
		return entityManager;
	}

	public void setEntityManager(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	public TypedApplicationContext getTestContext() {
		return testContext;
	}
}

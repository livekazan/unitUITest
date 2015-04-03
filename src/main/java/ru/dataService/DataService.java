package ru.dataService;

import ru.model.entity.Identifiable;
import ru.model.entity.User;
import ru.model.entity.directory.City;
import ru.model.enumPack.DocumentState;
import ru.model.enumPack.Role;
import ru.util.DateUtil;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class DataService {

    private EntityManager eM;

    @PersistenceContext
    public void setEntityManager(EntityManager eM) {
        this.eM = eM;
    }

    public EntityManager getEntityManager() {
        return eM;
    }


    public <T> T find(Long id, Class<T> clazz) {
        if(id==null || id<1l) return null;
        return getEntityManager().find(clazz, id);
    }


    public <T> List<T> findAll(Class<T> clazz) {
        try{
            List<T> list = (ArrayList<T>) getEntityManager().createQuery(
                    "SELECT i FROM " + clazz.getSimpleName() + " i ORDER BY i.id DESC").getResultList();
            return list;
        } catch(Exception e){
            e.printStackTrace();
            return new ArrayList<T>();
        }
    }

    public <T> Long findCountAll(Class<T> clazz) {
        try{
            return (Long)getEntityManager().createQuery(
                    "SELECT COUNT(i) FROM " + clazz.getSimpleName() + " i").getSingleResult();
        } catch(Exception e){
            return 0l;
        }
    }

    public void save(Identifiable data) {
        if (data.getId() == null) {
            getEntityManager().persist(data);
        } else {
            getEntityManager().merge(data);
        }
    }

    public void flushAndClear(){
        getEntityManager().flush();
        getEntityManager().clear();
    }


    public void remove(Identifiable t) {
        getEntityManager().remove(t);
    }



    /////////////////////////////////////

    public User findUser(String login,String password){
       List<User> userList =  getEntityManager().createQuery("Select i from User i where i.login = :login and i.password = :password")
               .setParameter("login", login)
               .setParameter("password", password)
               .getResultList();
        return  (userList!=null && userList.size()>0) ?  userList.get(0) : null;
    }


    public User findUserWithLogin(String login){
        List<User>  resultList =  getEntityManager().createQuery("Select i from User i where i.login= :login")
                .setParameter("login",login).setMaxResults(1).getResultList();
        return  (resultList!=null && resultList.size()>0) ?  resultList.get(0) : null;
    }


    public List<User> findAllUsers(Role role){
        return getEntityManager().createQuery("Select i from User i where i.role = :role and i.active = true ")
                .setParameter("role", role)
                .getResultList();
    }

    public List<User> findAllUsers(Long interviewId){
        return getEntityManager().createQuery("Select i from User i where i.interview.id = :interviewId and i.active = true ")
                .setParameter("interviewId", interviewId)
                .getResultList();
    }

    public List<City> findAllCity(DocumentState documentState){
        return getEntityManager().createQuery("Select i from City i where i.documentState = :documentState ")
                .setParameter("documentState", documentState)
                .getResultList();
    }

    public City findCityWithName(String name){
        List<City>  resultList =  getEntityManager().createQuery("Select i from City i where i.name= :name")
                .setParameter("name", name).setMaxResults(1).getResultList();
        return  (resultList!=null && resultList.size()>0) ?  resultList.get(0) : null;
    }

    public Long countOnlineUsers(){
        return (Long)getEntityManager().createQuery("Select count(i.id) from User i where i.lastActiveTime >= :currentTime and i.active=true")
                .setParameter("currentTime", DateUtil.addMunites(new Date(),-30))
                .getSingleResult();
    }

}
package ru.action.populate;

import ru.dataService.DataService;
import ru.model.entity.User;
import ru.model.entity.directory.City;
import ru.model.enumPack.DocumentState;
import ru.model.enumPack.Role;

import java.util.ArrayList;
import java.util.List;

public class PopulateUtil {

    public static List<User> popUsers(DataService dataService,int count,Role role){
        List<User> users = new ArrayList<User>();
        for(int i=0;i<count;i++){
            users.add(popUser(dataService,PasswordGenerator.generate(5),role));
        }
        return users;
    }

    private static City popCityWithoutSearch(DataService dataService,String name) {
        City city = new City();
        city.setName(name);
        dataService.save(city);
        return city;
    }

    public static City popCity(DataService dataService,String name) {
        City city = dataService.findCityWithName(name);
        if(city != null) return city;

        city = new City();
        city.setName(name);
        city.setDocumentState(DocumentState.isConfirm);
        dataService.save(city);
        return city;
    }

    public static User popUser(DataService dataService,String pass){
        User user  = new User();
        user.setActive(true);
        user.setLogin(PasswordGenerator.generate(7));
        user.setFIO(PasswordGenerator.generate(7));
        user.setPassword(pass);
        user.setRole(Role.operator);
        dataService.save(user);
        return  user;
    }

    public static User popUser(DataService dataService,String pass,Role role){
       User user  = new User();
        user.setActive(true);
        user.setLogin(PasswordGenerator.generate(7));
        user.setFIO(PasswordGenerator.generate(7));
        user.setPassword(pass);
        user.setRole(role);
        dataService.save(user);
        return  user;
    }
}

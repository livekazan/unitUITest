package ru.util;


import ru.model.enumPack.Descriptional;
import ru.model.json.SelectValueJSON;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ModelUtil {



    public static <T extends Enum<T> & Descriptional> List<SelectValueJSON> getEnumsWithCustomMap(Class<T> enumClass,Map<String,String> map) {
        List<SelectValueJSON> selectValueJSONs = new ArrayList<SelectValueJSON>();
        for(Map.Entry<String, String> entry : map.entrySet()) {
            SelectValueJSON state = new SelectValueJSON();
            String key = entry.getKey();
            String value = entry.getValue();
            state.setIndex(key);
            state.setName(value);
            selectValueJSONs.add(state);
        }
        selectValueJSONs.addAll(getEnums(enumClass));
        return selectValueJSONs;
    }

    public static <T extends Enum<T> & Descriptional> List<SelectValueJSON> getEnumsWithAll(Class<T> enumClass) {
        List<SelectValueJSON> selectValueJSONs = new ArrayList<SelectValueJSON>();
        SelectValueJSON stateAll = new SelectValueJSON();
        stateAll.setIndex("all");
        stateAll.setName("Все");
        selectValueJSONs.add(stateAll);
        selectValueJSONs.addAll(getEnums(enumClass));
        return selectValueJSONs;
    }

    public static <T extends Enum<T> & Descriptional> List<SelectValueJSON> getEnums(Class<T> enumClass) {
        List<SelectValueJSON> selectValueJSONs = new ArrayList<SelectValueJSON>();

        for (T e : enumClass.getEnumConstants()) {
            SelectValueJSON value = new SelectValueJSON();
            value.setIndex(e.toString());
            value.setName(e.getDescription());
            selectValueJSONs.add(value);
        }
        return selectValueJSONs;
    }


}

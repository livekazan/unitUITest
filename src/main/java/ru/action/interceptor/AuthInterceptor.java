/**
 * <copyright>
 * 
 * Copyright (c) 2012 EcoCompany.ru
 * 
 * </copyright>
 */
package ru.action.interceptor;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.Interceptor;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import ru.action.constant.SessionConstant;
import ru.dataService.DataService;
import ru.model.entity.User;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;

@Transactional
public class AuthInterceptor implements Interceptor {

	private static final String RETURN_ACTION_PARAMS = "returnActionParams";
	private static final String RETURN_ACTION_VALUE = "returnActionKeys";
	private static final String LOGIN = "login";
	private static final String INACTIVE = "inactive";
	private Logger LOGGER = Logger.getLogger(AuthInterceptor.class);
	@Autowired
    private DataService dataService;
	
	public AuthInterceptor() {
		super();
	}

	public void destroy() {
	}

	public void init() {
	}

	public String intercept(ActionInvocation invocation) throws Exception {
		Map<String, Object> session = invocation.getInvocationContext().getSession();
		User user = (User) session.get(SessionConstant.USER);
        if (user == null) {
            return LOGIN;
        }

        user = dataService.find(user.getId(),User.class);

        if (user == null) {
            return LOGIN;
        }

        user.setLastActiveTime(new Date());
        dataService.save(user);

		if(!user.isActive()){
			return  INACTIVE;
		}
		return invocation.invoke();

	}

	
	public void saveToSessionParamsandKeys(HttpServletRequest request){
		Map params = request.getParameterMap();
		Iterator i = params.keySet().iterator();
		StringBuilder strValues = new StringBuilder();
		StringBuilder strParams = new StringBuilder();
		if(request.getParameterMap().size()>0){
			while ( i.hasNext() )
			{
				String key = (String) i.next();
				String value = ((String[]) params.get( key ))[ 0 ];
				strValues.append(value).append(",");
				strParams.append(key).append(",");
				
			}
			strValues.delete(strValues.length()-1,strValues.length());
			strParams.delete(strParams.length()-1,strParams.length());
			
			ServletActionContext.getValueStack(ServletActionContext.getRequest()).set(RETURN_ACTION_PARAMS,
					strParams.toString());
			
			ServletActionContext.getValueStack(ServletActionContext.getRequest()).set(RETURN_ACTION_VALUE,
					strValues.toString());
			
			
		}
	}

    public DataService getDataService() {
        return dataService;
    }

    public void setDataService(DataService dataService) {
        this.dataService = dataService;
    }
}




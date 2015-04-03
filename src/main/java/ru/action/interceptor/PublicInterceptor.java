package ru.action.interceptor;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.Interceptor;

public class PublicInterceptor implements Interceptor {
	 
    //called during interceptor destruction
public void destroy() {
}

//called during interceptor initialization
public void init() {
}

//put interceptor code here
public String intercept(ActionInvocation invocation) throws Exception {
	return invocation.invoke();
}
}

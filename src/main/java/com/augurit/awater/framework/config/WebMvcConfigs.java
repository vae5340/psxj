package com.augurit.awater.framework.config;

import com.augurit.agcloud.bsc.sc.init.service.BscInitService;
import com.augurit.agcloud.framework.ui.pager.PageArgumentResolver;
import com.augurit.agcloud.util.login.Interceptor.LoginInterceptor;
import com.augurit.awater.util.ThirdUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.web.HttpMessageConverters;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mobile.device.DeviceHandlerMethodArgumentResolver;
import org.springframework.mobile.device.DeviceResolverHandlerInterceptor;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import javax.servlet.MultipartConfigElement;
import java.util.List;

@EnableWebMvc
@Configuration
public class WebMvcConfigs extends WebMvcConfigurerAdapter  {//implements WebMvcConfigurer
    private static Logger logger = LoggerFactory.getLogger(WebMvcConfigs.class);
    @Autowired
    protected BscInitService bscInitService;
    @Autowired
    private HttpMessageConverters messageConverters;
    @Value("${storage-url}")
    private String tempUrl;

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }


    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        logger.debug("初始化 EasyUI 分页请求参数处理器");

        argumentResolvers.add(pageArgumentResolver());

        logger.debug("OPUS子系统 - 添加移动设备检测机制");
        argumentResolvers.add(deviceHandlerMethodArgumentResolver());
    }

    /**
     * 定义拦截器链
     * @param registry
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(deviceResolverHandlerInterceptor());
        //拦截app请求
        registry.addInterceptor(new LoginInterceptor())
                .excludePathPatterns("/rest/app/login/**")
                .addPathPatterns("/rest/app/**");
    }


    //文件查看
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //String basePath = bscInitService.getConfigValueByConfigKey("uploadPath");
        String basePath = ThirdUtils.getInPath();
        basePath=basePath.replace("\\","//");
        if(!basePath.endsWith("/")){
            basePath+="/";
        }
        registry.addResourceHandler("/dri/rest/**").addResourceLocations("file:"+basePath);
        registry.addResourceHandler("/dri/**").addResourceLocations("file:"+basePath);
        super.addResourceHandlers(registry);
    }

    /**
     * 文件上传临时路径
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setLocation(tempUrl);
        return factory.createMultipartConfig();
    }
    @Bean(name="validator")
    public LocalValidatorFactoryBean getLocalValidatorFactoryBean(){
        return new LocalValidatorFactoryBean();
    }

    @Bean
    public ViewResolver getViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/ui-jsp/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
    @Bean
    public InternalResourceViewResolver configureInternalResourceViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/ui-jsp/");
        resolver.setSuffix(".jsp");
        resolver.setExposeContextBeansAsAttributes(true);
        return resolver;
    }

    //自动代理
    @Bean
    public DefaultAdvisorAutoProxyCreator getDefaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator daap = new DefaultAdvisorAutoProxyCreator();
        daap.setProxyTargetClass(true);
        return daap;
    }



    @Bean
    public PageArgumentResolver easyuiPageArgumentResolver() {
        return new PageArgumentResolver();
    }


    @Bean
    public PageArgumentResolver pageArgumentResolver() {
        return new PageArgumentResolver();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public com.augurit.agcloud.framework.util.JdkIdGenerator defaultIdGenerator() {
        return new com.augurit.agcloud.framework.util.JdkIdGenerator();
    }

   @Bean
    public RequestContextListener requestContextListener() {
        return new RequestContextListener();
    }

    // Opus子系统配置
    @Bean
    public DeviceResolverHandlerInterceptor deviceResolverHandlerInterceptor() {
        return new DeviceResolverHandlerInterceptor();
    }

    @Bean
    public DeviceHandlerMethodArgumentResolver deviceHandlerMethodArgumentResolver() {
        return new DeviceHandlerMethodArgumentResolver();
    }
    //设置访问默认首页
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }

}

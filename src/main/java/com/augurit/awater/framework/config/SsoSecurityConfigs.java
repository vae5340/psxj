
package com.augurit.awater.framework.config;

import com.augurit.agcloud.framework.config.FrameworkSsoProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;

@EnableOAuth2Sso
@Configuration
public class SsoSecurityConfigs extends WebSecurityConfigurerAdapter {
    @Autowired
    private FrameworkSsoProperties frameworkSsoProperties;

   @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.headers().frameOptions().disable();
        http.csrf().disable();
        if (this.frameworkSsoProperties.getEnable()) {
            ((ExpressionUrlAuthorizationConfigurer.AuthorizedUrl)((ExpressionUrlAuthorizationConfigurer.AuthorizedUrl)
            http.logout()
                    .logoutSuccessUrl(this.frameworkSsoProperties.getSsoLogoutUrl())
                    .and().authorizeRequests().antMatchers(new String[]{
                   "/css*//**//**//**//**//**//**//**//**",
                    "/dri//**//**",
                    "/diary/**",//测试地址
                    "/mobile*/**",
                    "/img*//**//**//**//**//**//**//**//**",
                    "/rest*//**//**//**//**//**//**//**//**"})).permitAll().anyRequest()).authenticated();
        } else {
            ((ExpressionUrlAuthorizationConfigurer.AuthorizedUrl)http.authorizeRequests().antMatchers(new String[]{"*//**//**//**//**//**//**//**//**"})).permitAll();
        }
    }

}

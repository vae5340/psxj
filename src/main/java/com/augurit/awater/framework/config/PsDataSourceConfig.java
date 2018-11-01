package com.augurit.awater.framework.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Map;

/*
@Primary
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(entityManagerFactoryRef = "entityManagerFactoryPrimary",
        transactionManagerRef ="transactionManagerPrimary",
        basePackages= { "com.augurit.awater.**.dao" })*/
public class PsDataSourceConfig {

   /* @Bean(name="psxjDataSource")
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource psxjDataSource() {
        return new DruidDataSource();
    }

    @Autowired
    @Qualifier("psxjDataSource")
    private DataSource psxjDataSource;

    @Bean(name = "entityManagerPrimary")
    @Primary
    public EntityManager entityManager(EntityManagerFactoryBuilder builder) {
        return entityManagerFactoryBeanPrimary(builder).getObject().createEntityManager();
    }
    @Bean(name="entityManagerFactoryBeanPrimary")
    @Primary
    public LocalContainerEntityManagerFactoryBean entityManagerFactoryBeanPrimary(EntityManagerFactoryBuilder  builder){
        return builder
                .dataSource(psxjDataSource)
                .properties(getVendorProperties())
                .packages(new String[]{"com.augurit.awater.**.entity"}) //设置实体类所在位置
                .persistenceUnit("psxjPersistenceUnit")
                .build();
    }

    @Autowired(required=false)
    private JpaProperties jpaProperties;

    private Map<String, Object> getVendorProperties() {
        return jpaProperties.getHibernateProperties(new HibernateSettings());
    }
    @Bean(name = "transactionManagerPrimary")
    @Primary
    public PlatformTransactionManager transactionManagerPrimary(EntityManagerFactoryBuilder builder) {
        return new JpaTransactionManager(entityManagerFactoryBeanPrimary(builder).getObject());
    }*/
}

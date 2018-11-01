package com.augurit.agcloud.common.service;

import com.augurit.awater.common.page.Page;

import java.io.Serializable;
import com.augurit.awater.common.page.Page;

public interface ICrudService<T, ID extends Serializable> {
    T get(ID var1);

    void save(T... var1);

    void delete(ID... var1);

    Page<T> search(Page<T> var1, T var2);
}
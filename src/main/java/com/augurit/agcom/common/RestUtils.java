package com.augurit.agcom.common;

import java.io.InputStream;

public class RestUtils {
	/**
	 * 解析POST通过请求体传递过来的参数
	 * @param is
	 * @return
	 */
	public static String pasePostInputStream(InputStream is){
		String post = null;
		try {
			byte postData[] = new byte[999999];
			int ind = is.read();
			int i = 0;
			postData[i] = (byte) ind;
			while (ind != -1) {
				ind = is.read();
				if (ind != -1) {
					i++;
					if(i >= postData.length){
						byte postDatacopy[] = postData;
						postData = new byte[postData.length * 2];
						System.arraycopy(postDatacopy, 0, postData, 0, postDatacopy.length);
					}
					postData[i] = (byte) ind;
				}
			}
			byte data2[] = new byte[i + 1];
			System.arraycopy(postData, 0, data2, 0, data2.length);
			post = new String(postData,"utf-8");
//			System.out.println(post);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return post;
	}
}

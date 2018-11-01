package com.augurit.awater.util.file;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServletRequest;

import com.augurit.agcloud.bsc.sc.att.utils.FileUtils;
import com.augurit.awater.bpm.file.web.form.SysFileForm;
import org.apache.commons.lang3.StringUtils;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

public class SysFileUtils {
    public static final String BLANK_DOC_PATH = "resources/components/ntko/docs";
    public static final String BLANK_WORD = "resources/components/ntko/docs/blank.doc";
    public static final String BLANK_EXCEL = "resources/components/ntko/docs/blank.xls";
    public static final String BLANK_PROJECT = "resources/components/ntko/docs/blank.mpp";
    public static final String BLANK_VISIO = "resources/components/ntko/docs/blank.vsd";
    public static final String BLANK_PPT = "resources/components/ntko/docs/blank.ppt";
    public static final String ZIP_FILENAME = "";
    public static final String ZIP_DIR = "";
    public static final String UN_ZIP_DIR = "";
    public static final int BUFFER = 1024;
    public static String DEFAULT_ATTACHMENT_FILEPATH = "upload";
    public static String ATTACH_UPLOAD_TYPE = "code_name";
    public static final String ENCODING_GBK = "encoding:GBK";
    private static final int THIRTYSIX_RADIX = 36;
    private static short counter = 0;

    public SysFileUtils() {
    }

    public static String getFormatedRedirectUrl(String rootPath, String redirectUrl) {
        return rootPath != null && redirectUrl != null ? rootPath + StringUtils.replace(redirectUrl, ",", "&") : null;
    }

    public static void zipFile(List<SysFileForm> fileList, String rootPath, String fileName, HttpServletRequest request) throws Exception {
        File zipFile = new File(rootPath + "/" + fileName);
        if (zipFile.exists()) {
            zipFile.delete();
        }

        ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(rootPath + "/" + fileName));
        ZipEntry ze = null;
        byte[] buf = new byte[1024];
        int readLen = 0;

        for(int i = 0; i < fileList.size(); ++i) {
            SysFileForm file = (SysFileForm)fileList.get(i);
            ze = new ZipEntry(file.getFileName() + "." + file.getFileFormat());
            ze.setSize(file.getFileSize().longValue());
            zos.putNextEntry(ze);
            zos.setEncoding("gbk");
            String diskFileName = file.getFileCode() + "_" + file.getFileName() + "." + file.getFileFormat();
            if (!ATTACH_UPLOAD_TYPE.equals("code_name")) {
                diskFileName = file.getFileCode() + "." + file.getFileFormat();
            }

            String absoluteFileName = rootPath + "/" + diskFileName;
            System.out.println(absoluteFileName);
            FileUtils.reEncodeChineseFileName(absoluteFileName, request);
            BufferedInputStream is = new BufferedInputStream(new FileInputStream(absoluteFileName));

            while((readLen = is.read(buf, 0, 1024)) != -1) {
                zos.write(buf, 0, readLen);
            }

            is.close();
        }

        zos.close();
    }

    public static boolean isAbsolutePath(String pathstr) {
        Pattern p = Pattern.compile("^[a-zA-Z]:(\\\\[^\\:<>/|]+)+$");
        Matcher m = p.matcher(pathstr);
        return m.matches();
    }

    public static String nextFileCode() {
        return Long.toString(System.currentTimeMillis(), 36) + Long.toString((long)getCount(), 36);
    }

    protected static short getCount() {
        Class var0 = SysFileUtils.class;
        synchronized(SysFileUtils.class) {
            if (counter < 0) {
                counter = 0;
            }

            return counter++;
        }
    }

    public static void main(String[] args) {
        for(int i = 0; i < 100; ++i) {
            System.out.println(nextFileCode());
        }

    }
}

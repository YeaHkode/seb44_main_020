package com.moovda_project.moovda.movie.controller;


import com.moovda_project.moovda.movie.service.ApiService;
import org.springframework.stereotype.Component;


import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URLEncoder;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;

@Component
public class ApiController {

    private final ApiService apiService;

    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }


    @PostConstruct
    public void callApi() throws IOException {
        StringBuilder urlBuilder = new StringBuilder("http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&ServiceKey="); /*URL*/
        urlBuilder.append("&" + URLEncoder.encode("listCount","UTF-8") + "=" + URLEncoder.encode("10", "UTF-8")); /*Service Key*/
        urlBuilder.append("&" + URLEncoder.encode("nation","UTF-8") + "=" + URLEncoder.encode("대한민국", "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("director","UTF-8") + "=" + URLEncoder.encode("박찬욱", "UTF-8"));



        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");

        System.out.println("Response code: " + conn.getResponseCode());

        BufferedReader rd;
        if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }

        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }

        rd.close();
        conn.disconnect();
        apiService.init(sb.toString());
    }

}

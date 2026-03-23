<?php

class Supabase {
    private $url;
    private $key;

    public function __construct($url, $key) {
        $this->url = rtrim($url, '/');
        $this->key = $key;
    }

    public function insert($table, $data) {
        return $this->request('POST', "/rest/v1/$table", $data);
    }

    public function select($table, $query = '*') {
        return $this->request('GET', "/rest/v1/$table?select=$query");
    }

    public function selectWithFilter($table, $filter, $query = '*') {
        return $this->request('GET', "/rest/v1/$table?select=$query&$filter");
    }

    private function request($method, $path, $data = null) {
        $ch = curl_init($this->url . $path);
        
        $headers = [
            "apikey: " . $this->key,
            "Authorization: Bearer " . $this->key,
            "Content-Type: application/json",
            "Prefer: return=representation"
        ];

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 400) {
            return ['error' => true, 'status' => $httpCode, 'message' => $response];
        }

        return json_decode($response, true);
    }
}

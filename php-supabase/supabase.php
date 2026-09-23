<?php
require_once __DIR__ . '/config.php';

class SupabaseClient {
    private $url;
    private $headers;

    public function __construct() {
        $this->url = rtrim(SUPABASE_URL, '/');
        $this->headers = get_supabase_headers();
    }

    /**
     * Executa requisições HTTP para a API PostgREST do Supabase
     */
    private function request($endpoint, $method = 'GET', $data = null) {
        $ch = curl_init($this->url . '/rest/v1/' . ltrim($endpoint, '/'));
        
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            return ['error' => $error, 'code' => 500];
        }

        $decoded = json_decode($response, true);
        return [
            'code' => $httpCode,
            'data' => $decoded
        ];
    }

    /**
     * Busca todas as assinaturas salvas
     */
    public function getSignatures() {
        $res = $this->request('signatures?select=*&order=created_at.desc');
        return ($res['code'] >= 200 && $res['code'] < 300) ? ($res['data'] ?? []) : [];
    }

    /**
     * Busca uma assinatura por ID
     */
    public function getSignatureById($id) {
        $res = $this->request("signatures?id=eq.{$id}&select=*");
        if ($res['code'] >= 200 && $res['code'] < 300 && !empty($res['data'])) {
            return $res['data'][0];
        }
        return null;
    }

    /**
     * Cria ou atualiza uma assinatura
     */
    public function saveSignature($data) {
        if (!empty($data['id'])) {
            $id = $data['id'];
            unset($data['id']);
            $data['updated_at'] = date('c');
            $res = $this->request("signatures?id=eq.{$id}", 'PATCH', $data);
        } else {
            unset($data['id']);
            $res = $this->request('signatures', 'POST', $data);
        }

        return $res;
    }

    /**
     * Deleta uma assinatura
     */
    public function deleteSignature($id) {
        return $this->request("signatures?id=eq.{$id}", 'DELETE');
    }
}

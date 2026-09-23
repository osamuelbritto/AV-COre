<?php
/**
 * Configuração de Conexão com o Supabase
 * 
 * Obtenha sua URL e CHAVE no painel do Supabase:
 * Settings > API > Project URL & anon / public API key
 */

define('SUPABASE_URL', getenv('SUPABASE_URL') ?: 'https://seu-projeto.supabase.co');
define('SUPABASE_KEY', getenv('SUPABASE_KEY') ?: 'sua-chave-anon-ou-service-role');

// Define cabeçalhos padrões para requisições ao Supabase PostgREST
function get_supabase_headers() {
    return [
        'Content-Type: application/json',
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Prefer: return=representation'
    ];
}

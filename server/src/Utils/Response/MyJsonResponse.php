<?php


namespace App\Utils\Response;


use App\Utils\Struct\CustomResponseStruct;
use Symfony\Component\HttpFoundation\JsonResponse;

class MyJsonResponse extends JsonResponse
{


    public function __construct($data = null, $error = null, int $status = 200, array $headers = [], bool $json = false)
    {
        $response = new CustomResponseStruct();
        $response->data = $data;
        $response->error = $error;
        parent::__construct($response, $status, $headers, $json);
    }
}
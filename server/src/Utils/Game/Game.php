<?php


namespace App\Utils\Game;



use App\Utils\Struct\CardActionStruct;

interface Game
{
    public const MACAO = "Macao";
    public const PAN = "Pan";
    public static function actionCard(string $cardAlias, $choose): CardActionStruct;


}

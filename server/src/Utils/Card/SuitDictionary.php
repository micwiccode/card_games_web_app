<?php


namespace App\Utils\Card;



class SuitDictionary
{
    public const SPADES = 'S';

    public const HEARTS = 'H';

    public const DIAMONDS = 'D';

    public const CLUBS = 'C';

    public static function getSuits(){
        return [
            self::SPADES,
            self::HEARTS,
            self::DIAMONDS,
            self::CLUBS
        ];
    }

    public static function getPolishRepresentation(string $suit){
        switch ($suit){
            case self::SPADES: return "pik";
            case self::HEARTS: return "kier";
            case self::CLUBS: return "trefl";
            case self::DIAMONDS: return "karo";
            default: return null;
        }
    }


}
